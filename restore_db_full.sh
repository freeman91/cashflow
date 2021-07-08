#! /usr/bin/env zsh

help()
{
   echo "options:"
   echo "g     generate seeds"
   echo "r     restore cashflow2 db from seeds"
   echo "h     Print this help"
   echo
}

genSeeds()
{
  echo "run this on jupiter\n"
  echo "cd repos/cashflow-api && rails runner db_workbench.rb && exit\n"
  ssh -t admin@192.168.0.42 "zsh -l"
}

restore()
{
  python migrate_data.py migrate_all
}

while getopts ":hgr" option; do
   case $option in
      h) 
         help
         exit;;
      g)
        genSeeds;;
      r)
        restore;;
   esac
done

exit
